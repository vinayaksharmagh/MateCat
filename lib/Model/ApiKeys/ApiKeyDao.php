<?php

class ApiKeys_ApiKeyDao extends DataAccess_AbstractDao {

  static function findByKey($key) {
    $conn = Database::obtain()->getConnection();
    $stmt = $conn->prepare("SELECT * FROM api_keys WHERE enabled AND api_key = ?");
    $stmt->execute( array( $key ) ) ;

    $stmt->setFetchMode(PDO::FETCH_CLASS, 'ApiKeys_ApiKeyStruct');
    return $stmt->fetch();
  }

  public function create( $obj ) {
    $conn = $this->con->getConnection();

    $obj->create_date = date('Y-m-d H:i:s');
    $obj->last_update = date('Y-m-d H:i:s');

    $stmt = $conn->prepare("INSERT INTO api_keys " .
      " ( uid, api_key, api_secret, create_date, last_update, enabled ) " .
      " VALUES "  .
      " ( :uid, :api_key, :api_secret, :create_date, :last_update, :enabled ) "
    );

    $values = array_diff_key( $obj->toArray(), array('id' => null) );

    Log::doLog( $values );

    $stmt->execute( $values );
    return $this->getById( $conn->lastInsertId() )[0];
  }

  public function getById( $id ) {
    $conn = $this->con->getConnection();

    $stmt = $conn->prepare(" SELECT * FROM api_keys WHERE id = ? ");
    $stmt->execute( array( $id ) );
    return $stmt->fetchAll( PDO::FETCH_CLASS, 'ApiKeys_ApiKeyStruct');
  }

  protected function _buildResult( $array_result ) {

  }
}
